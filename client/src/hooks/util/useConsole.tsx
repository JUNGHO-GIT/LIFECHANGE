// useConsole.tsx

import { useEffect, useRef } from "@importReacts";

// -------------------------------------------------------------------------------------------------
export const useConsole = (title: string, target: any) => {
  const prevTargetRef = useRef<any>(null);

	// 2-3. useEffect -----------------------------------------------------------------------------
	useEffect(() => {
    // Only log in development mode to avoid production performance impact
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    // Skip logging if target hasn't changed (shallow comparison)
    if (prevTargetRef.current === target) {
      return;
    }

    // Use more efficient logging for large objects
    try {
      if (target && typeof target === 'object' && Object.keys(target).length > 10) {
        console.log(`${title} (large object):`, target);
      } else {
        console.log(`${title} :`, JSON.stringify(target, null, 2));
      }
    } catch (error) {
      // Fallback for circular references
      console.log(`${title} (fallback):`, target);
    }

    prevTargetRef.current = target;
	}, [title, target]);
};
