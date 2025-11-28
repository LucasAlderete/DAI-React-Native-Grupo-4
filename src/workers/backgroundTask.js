import * as TaskManager from 'expo-task-manager';
import * as BackgroundTask from 'expo-background-task';
import { startPolling } from './pollingService';

const TASK_NAME = 'background-polling-task';

TaskManager.defineTask(TASK_NAME, async () => {
  try {
    await startPolling();
    return BackgroundTask.BackgroundTaskResult.NewData;
  } catch (err) {
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});

export async function registerBackgroundTask() {
  try {
    const status = await BackgroundTask.getStatusAsync();
    console.log('Background task status:', status);

    if (status === BackgroundTask.BackgroundTaskStatus.Available) {
      await BackgroundTask.startAsync(TASK_NAME);
      console.log('Background task iniciada');
    } else {
      console.log('Background task no disponible:', status);
    }
  } catch (err) {
    console.log('Error registrando background task:', err);
  }
}
