import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

export interface FileViewModel {
  id: string;
  fileName: string;
  formattedFileSize: string;
  canRetry: boolean;
  canDelete: boolean;
  statusIcon: IconDefinition;
  statusColorClass: 'red' | 'green' | 'black';
  showProgress: boolean;
  progress: number;
  errorMessage: string;
}
