param tags object = {}
param keyVaultName string
param contentType string = 'string'
param rgName string
@description('The value of the secret. Provide only derived values like blob storage access, but do not hard code any secrets in your templates')
@secure()
param postgresAdminPassword string

param cognitiveServiceName string

param enabled bool = true
param exp int = 0
param nbf int = 0

module postgreSQLDBSecret '../core/security/keyvault-secret.bicep' = {
  name: 'postgreSQLDBKey'
  params: {
    name: 'postgreSQLDBKey'
    keyVaultName : keyVaultName
    tags: tags
    enabled: enabled
    exp: exp
    nbf: nbf
    contentType: contentType
    secretValue: postgresAdminPassword
  }
}

module cognitiveServiceSecret '../core/security/keyvault-secret.bicep' = {
  name: 'cognitiveServiceKey'
  params: {
    name: 'cognitiveServiceKey'
    keyVaultName : keyVaultName
    tags: tags
    enabled: enabled
    exp: exp
    nbf: nbf
    contentType: contentType
    secretValue: listKeys(resourceId(subscription().subscriptionId, rgName, 'Microsoft.CognitiveServices/accounts', cognitiveServiceName), '2023-05-01').key1
  }
}


output POSTGRESQL_DB_KEY string = postgreSQLDBSecret.name
output COGNITIVE_SERVICE_KEY string = cognitiveServiceSecret.name
