@description('The name of the Cognitive Service.')
param name string

@description('The location into which your Azure resources should be deployed.')
param location string = resourceGroup().location

@description('The tags to apply to each resource.')
param tags object = {}

@description('The kind of Cognitive Service to create. See: https://learn.microsoft.com/en-us/azure/cognitive-services/create-account-bicep for available kinds.')
@allowed([ 'CognitiveServices', 'ComputerVision', 'CustomVision.Prediction', 'CustomVision.Training', 'Face', 'FormRecognizer', 'SpeechServices', 'LUIS', 'QnAMaker', 'TextAnalytics', 'TextTranslation', 'AnomalyDetector', 'ContentModerator', 'Personalizer', 'OpenAI' ])
param kind string

@description('The name of the SKU. Be aware that not all SKUs may be available for your Subscription. See: https://learn.microsoft.com/en-us/rest/api/cognitiveservices/accountmanagement/resource-skus')
@allowed([ 'F0', 'S0', 'S1', 'S2', 'S3', 'S4' ])
param sku string

param publicNetworkAccess string = 'Enabled'

resource cognitiveService 'Microsoft.CognitiveServices/accounts@2023-05-01' = {
  name: name
  location: location
  tags: tags
  sku: {
    name: sku
  }
  kind: kind
  properties: {
    publicNetworkAccess: publicNetworkAccess

  }
}

@description('Resource Name')
output name string = cognitiveService.name

@description('Resource Id')
output id string = cognitiveService.id

@description('Endpoint')
output endpoint string = cognitiveService.properties.endpoint
