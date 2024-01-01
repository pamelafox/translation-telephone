param keyVaultName string
param rgName string

param name string
param cognitiveServiceName string

// Store Cognitive Service Key in Key Vault
module cognitiveServiceSecret '../core/security/keyvault-secret.bicep' = {
  name: 'cognitiveServiceKey'
  params: {
    name: name
    keyVaultName : keyVaultName
    secretValue: listKeys(resourceId(subscription().subscriptionId, rgName, 'Microsoft.CognitiveServices/accounts', cognitiveServiceName), '2023-05-01').key1
  }
}
