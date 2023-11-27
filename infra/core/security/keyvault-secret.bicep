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

resource postgreSQLDBSecret 'Microsoft.KeyVault/vaults/secrets@2022-07-01' = {
  name: 'postgreSQLDBKey'
  tags: tags
  parent: keyVault
  properties: {
    attributes: {
      enabled: enabled
      exp: exp
      nbf: nbf
    }
    contentType: contentType
    value: postgresAdminPassword
  }
}

resource cognitiveServiceSecret 'Microsoft.KeyVault/vaults/secrets@2022-07-01' = {
  name: 'cognitiveServiceKey'
  tags: tags
  parent: keyVault
  properties: {
    attributes: {
      enabled: enabled
      exp: exp
      nbf: nbf
    }
    contentType: contentType
    value: listKeys(resourceId(subscription().subscriptionId, rgName, 'Microsoft.CognitiveServices/accounts', cognitiveServiceName), '2023-05-01').key1
  }
}

resource keyVault 'Microsoft.KeyVault/vaults@2022-07-01' existing = {
  name: keyVaultName
}


output POSTGRESQL_DB_KEY string = postgreSQLDBSecret.name
output COGNITIVE_SERVICE_KEY string = cognitiveServiceSecret.name
