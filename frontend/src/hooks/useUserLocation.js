import { useMemo } from 'react';

/**
 * User च्या registered location मिळवा.
 * localStorage मधील `kv_user` मधून वाचतो.
 */
export function useUserLocation() {
  return useMemo(() => {
    const user = JSON.parse(localStorage.getItem('kv_user') || '{}');
    return {
      district: user.district || '',
      taluka: user.taluka || '',
      village: user.village || '',
      pincode: user.pincode || ''
    };
  }, []);
}

/**
 * User चे location update करा (localStorage मध्ये).
 */
export function updateUserLocation(location) {
  const user = JSON.parse(localStorage.getItem('kv_user') || '{}');
  const updated = { ...user, ...location };
  localStorage.setItem('kv_user', JSON.stringify(updated));
  return updated;
}

/**
 * Location field साठी initial value.
 */
export function getInitialLocation(currentValue, registeredLocation) {
  return currentValue || registeredLocation || '';
}