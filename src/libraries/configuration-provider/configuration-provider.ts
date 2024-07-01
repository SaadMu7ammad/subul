import convict from 'convict';

let convictConfigurationProvider: convict.Config<any> | undefined;

export function initializeAndValidate(schema: string | convict.Schema<any>) {
  convictConfigurationProvider = convict(schema);
  convictConfigurationProvider.validate();
}

// Meant mostly for testing purposes, to allow resetting the state between tests
export function reset() {
  convictConfigurationProvider = undefined;
}

export function getValue(keyName: string) {
  if (convictConfigurationProvider === undefined) {
    throw new Error('Configuration has not been initialized yet');
  }
  // @ts-expect-error >> any type
  return convictConfigurationProvider.get(keyName);
}
