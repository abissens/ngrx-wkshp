import {Injectable} from '@angular/core';
import {delay, map, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DebuggerDev {

  getConfig(key: string): DebuggerConfig {
    const value = localStorage.getItem(key);
    if(!value || value.trim() === '') {
      return {
        delay: undefined,
        error: undefined
      };
    }
    const jsonSanitized = value.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":');
    return JSON.parse(jsonSanitized);
  }

  applyDc<T>(input: Observable<T>, config: DebuggerConfig) {
    return input.pipe(
      delay(config.delay ?? 0),
      map(v => {
        if (config.error !== undefined) {
          throw new Error(config.error)
        }
        return v;
      }));
  }
}

export interface DebuggerConfig {

  delay: number | undefined
  error: string | undefined
}
