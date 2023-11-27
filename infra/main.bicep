targetScope = 'subscription'

@minLength(1)
@maxLength(64)
@description('Name which is used to generate a short unique hash for each resource')
param name string

@minLength(1)
@description('Primary location for all resources')
param location string

@description('Id of the user or app to assign application roles')
param principalId string = ''

@secure()
@description('PostGreSQL Server administrator password')
param postgresAdminPassword string

var resourceToken = toLower(uniqueString(subscription().id, name, location))
var tags = { 'azd-env-name': name }
var prefix = '${name}-${resourceToken}'
var rgName = '${prefix}-rg'

resource resourceGroup 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: rgName
  location: location
  tags: tags
}

module cognitiveService 'core/ai/cognitiveservices.bicep' = {
  name: 'cognitiveservice'
  scope: resourceGroup
  params: {
    name: '${prefix}-cognitiveservice'
    location: location
    sku:  'S1'
    kind: 'TextTranslation'
    publicNetworkAccess: 'Enabled'
  }
}

// Store secrets in a keyvault
module keyVault './core/security/keyvault.bicep' = {
  name: 'keyvault'
  scope: resourceGroup
  params: {
    name: '${take(replace(prefix, '-', ''), 17)}-vault'
    location: location
    tags: tags
    principalId: principalId
  }
}

module keyVaultSecret './core/security/keyvault-secret.bicep' = {
  name: 'keyvaultsecret'
  scope: resourceGroup
  params: {
    rgName: rgName
    keyVaultName: keyVault.outputs.name
    postgresAdminPassword: postgresAdminPassword
    cognitiveServiceName: cognitiveService.outputs.name
  }
}

module webaccess './core/security/keyvault-access.bicep' = {
  name: 'web-keyvault-access'
  scope: resourceGroup
  params: {
    keyVaultName: keyVault.outputs.name 
    principalId: web.outputs.identityPrincipalId 
  } 
}

var postgresServerName = '${prefix}-postgres'
var postgresServerAdmin = 'admin${uniqueString(resourceGroup.id)}'
var postgresDatabaseName = 'transtel'


module postgresServer 'core/database/postgresql/flexibleserver.bicep' = {
  name: 'postgresql'
  scope: resourceGroup
  params: {
    name: postgresServerName
    location: location
    tags: tags
    sku: {
      name: 'Standard_B1ms'
      tier: 'Burstable'
    }
    storage: {
      storageSizeGB: 32
    }
    version: '13'
    administratorLogin: postgresServerAdmin
    administratorLoginPassword: postgresAdminPassword
    databaseNames: [postgresDatabaseName]
    allowAzureIPsFirewall: true
  }
}

module web 'core/host/appservice.bicep' = {
  name: 'appservice'
  scope: resourceGroup
  params: {
    name: '${prefix}-appservice'
    location: location
    tags: union(tags, { 'azd-service-name': 'web' })
    appServicePlanId: appServicePlan.outputs.id
    runtimeName: 'python'
    runtimeVersion: '3.10'
    scmDoBuildDuringDeployment: true
    ftpsState: 'Disabled'
    appSettings: {
      DBHOST: '${postgresServerName}.postgres.database.azure.com'
      DBNAME: postgresDatabaseName
      DBUSER: postgresServerAdmin
      DBPASS: postgresAdminPassword
      FLASK_APP: 'src'
      AZURE_COGNITIVE_SERVICE_KEY: keyVaultSecret.outputs.COGNITIVE_SERVICE_KEY
      AZURE_KEY_VAULT_ENDPOINT: keyVault.outputs.endpoint
      AZURE_TRANSLATE_API_KEY: ''
    }
    keyVaultName: keyVault.outputs.name
  }
}

module appServicePlan 'core/host/appserviceplan.bicep' = {
  name: 'serviceplan'
  scope: resourceGroup
  params: {
    name: '${prefix}-appserviceplan'
    location: location
    tags: tags
    sku: {
      name: 'B1'
    }
    reserved: true
  }
}


output WEB_URI string = web.outputs.uri
output AZURE_LOCATION string = location
