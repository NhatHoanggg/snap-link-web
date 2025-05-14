import type { Service } from './services/services.service';
import type { Photographer } from './services/photographer.service';

export interface RequestFormData {
  date: string;
  photographer: Photographer;
  service: Service;
  details: {
    location: string;
    duration: number;
    notes: string;
  };
}

export interface RequestFormStep {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
}

export interface RequestFormState {
  currentStep: number;
  steps: RequestFormStep[];
  formData: RequestFormData;
  isLoading: boolean;
  error: string | null;
}

export interface RequestFormContextType {
  state: RequestFormState;
  setDate: (date: string) => void;
  setPhotographer: (photographer: Photographer) => void;
  setService: (service: Service) => void;
  setDetails: (details: RequestFormData['details']) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  submitRequest: () => Promise<void>;
  resetForm: () => void;
} 