import { useEffect, useMemo, useState } from 'react';

import { useAppPreferences } from '@/src/core/providers/app-provider';
import { translateLocationLabel } from '@/src/services/location/location-label-translation';
import { countryStateCityService } from '@/src/services/location/country-state-city';
import type { SelectOption } from '@/src/types';

type UseCountryStateCityOptionsArgs = {
  countryName?: string;
  stateName?: string;
};

export function useCountryStateCityOptions(args?: UseCountryStateCityOptionsArgs) {
  const { language } = useAppPreferences();
  const [internalCountryCode, setInternalCountryCode] = useState('IN');
  const [internalStateCode, setInternalStateCode] = useState('');
  const [countries, setCountries] = useState<{ name: string; iso2: string }[]>([]);
  const [states, setStates] = useState<{ name: string; iso2: string }[]>([]);
  const [cities, setCities] = useState<{ name: string }[]>([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [countryError, setCountryError] = useState<string | undefined>();
  const [stateError, setStateError] = useState<string | undefined>();
  const [cityError, setCityError] = useState<string | undefined>();

  const countryCode = useMemo(() => {
    if (!args?.countryName) {
      return internalCountryCode;
    }

    const match = countries.find((item) => item.name === args.countryName);
    return match?.iso2 ?? 'IN';
  }, [args?.countryName, countries, internalCountryCode]);

  useEffect(() => {
    let isMounted = true;
    setIsLoadingCountries(true);
    setCountryError(undefined);

    countryStateCityService
      .getCountries()
      .then((items) => {
        if (isMounted) setCountries(items);
      })
      .catch((error) => {
        if (isMounted) setCountryError(error instanceof Error ? error.message : 'Unable to load countries.');
      })
      .finally(() => {
        if (isMounted) setIsLoadingCountries(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    setIsLoadingStates(true);
    setStateError(undefined);
    setStates([]);

    countryStateCityService
      .getStates(countryCode)
      .then((items) => {
        if (isMounted) setStates(items);
      })
      .catch((error) => {
        if (isMounted) setStateError(error instanceof Error ? error.message : 'Unable to load states.');
      })
      .finally(() => {
        if (isMounted) setIsLoadingStates(false);
      });

    return () => {
      isMounted = false;
    };
  }, [countryCode]);

  const countryOptions = useMemo<SelectOption[]>(
    () =>
      countries.map((item) => ({ label: translateLocationLabel(item.name, language), value: item.name })),
    [countries, language],
  );

  const stateCode = useMemo(() => {
    const selectedState = args?.stateName || internalStateCode;
    if (!selectedState) return '';

    const match = states.find((item) => item.name === selectedState || item.iso2 === selectedState);
    return match?.iso2 ?? selectedState;
  }, [args?.stateName, internalStateCode, states]);

  const stateOptions = useMemo<SelectOption[]>(
    () =>
      states.map((item) => ({ label: translateLocationLabel(item.name, language), value: item.name })),
    [language, states],
  );

  const cityOptions = useMemo<SelectOption[]>(
    () =>
      cities.map((item) => ({ label: translateLocationLabel(item.name, language), value: item.name })),
    [cities, language],
  );

  useEffect(() => {
    let isMounted = true;
    setIsLoadingCities(Boolean(stateCode));
    setCityError(undefined);
    setCities([]);

    if (!stateCode) {
      setIsLoadingCities(false);
      return () => {
        isMounted = false;
      };
    }

    countryStateCityService
      .getCities(countryCode, stateCode)
      .then((items) => {
        if (isMounted) setCities(items);
      })
      .catch((error) => {
        if (isMounted) setCityError(error instanceof Error ? error.message : 'Unable to load cities.');
      })
      .finally(() => {
        if (isMounted) setIsLoadingCities(false);
      });

    return () => {
      isMounted = false;
    };
  }, [countryCode, stateCode]);

  function selectCountry(nextCountryName: string) {
    const match = countries.find((item) => item.name === nextCountryName);
    setInternalCountryCode(match?.iso2 ?? 'IN');
    setInternalStateCode('');
  }

  function selectState(nextStateName: string) {
    setInternalStateCode(nextStateName);
  }

  function resetLocation() {
    setInternalCountryCode('IN');
    setInternalStateCode('');
  }

  return {
    countryCode,
    stateCode,
    countryOptions,
    stateOptions,
    cityOptions,
    isLoadingCountries,
    isLoadingStates,
    isLoadingCities,
    countryError,
    stateError,
    cityError,
    selectCountry,
    selectState,
    resetLocation,
  };
}
