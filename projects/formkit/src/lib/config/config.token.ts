import { InjectionToken } from '@angular/core';
import { FormKitModuleConfig } from '../models';

export const FORMKIT_MODULE_CONFIG_TOKEN = new InjectionToken<Required<FormKitModuleConfig>>('FormKit-Config');
