import { useEffect, useState } from 'react';
import { isBrowser } from '@pareesh/internal-utils';

export type StandardPermissionName =
  | 'geolocation'
  | 'notifications'
  | 'camera'
  | 'microphone'
  | 'clipboard-read'
  | 'clipboard-write';

export type ExtendedPermissionState = PermissionState | 'unsupported';

export interface UsePermissionResult {
  state: ExtendedPermissionState;
  isSupported: boolean;
  isLoading: boolean;
}

function checkPermissionsSupported(): boolean {
  return Boolean(
    isBrowser &&
      typeof navigator !== 'undefined' &&
      'permissions' in navigator &&
      navigator.permissions &&
      typeof navigator.permissions.query === 'function'
  );
}

export function usePermission(
  permissionName: StandardPermissionName | PermissionDescriptor['name']
): UsePermissionResult {
  const supported = checkPermissionsSupported();

  const [state, setState] = useState<ExtendedPermissionState>(() =>
    supported ? 'prompt' : 'unsupported'
  );
  const [isSupported, setIsSupported] = useState<boolean>(supported);
  const [isLoading, setIsLoading] = useState(supported);

  useEffect(() => {
    const isNowSupported = checkPermissionsSupported();
    setIsSupported(isNowSupported);

    if (!isNowSupported) {
      setState('unsupported');
      setIsLoading(false);
      return;
    }

    let statusRef: PermissionStatus | null = null;
    let isCancelled = false;

    const queryPermission = async () => {
      try {
        if (!navigator.permissions?.query) {
          if (!isCancelled) {
            setState('unsupported');
            setIsLoading(false);
          }
          return;
        }
        const descriptor = { name: permissionName } as PermissionDescriptor;
        const status = await navigator.permissions.query(descriptor);

        if (isCancelled) return;
        statusRef = status;
        setState(status.state);
        setIsLoading(false);

        const handleChange = () => {
          if (!isCancelled) {
            setState(status.state);
          }
        };

        status.addEventListener('change', handleChange);

        return () => {
          status.removeEventListener('change', handleChange);
        };
      } catch {
        if (!isCancelled) {
          setState('unsupported');
          setIsLoading(false);
        }
      }
    };

    const cleanupPromise = queryPermission();

    return () => {
      isCancelled = true;
      void cleanupPromise.then((clean) => clean?.());
    };
  }, [permissionName]);

  return {
    state,
    isSupported,
    isLoading
  };
}
