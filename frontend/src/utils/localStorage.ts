import { useState } from "react";

// Définition du hook useLocalStorage
function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((val: T) => T)) => void] {
  // Utiliser useState pour stocker la valeur
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Essayer de récupérer la valeur du localStorage par la clé
      const item = window.localStorage.getItem(key);
      // Parse et retourner la valeur stockée ou, si non trouvée, retourner la valeur initiale
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // En cas d'erreur, retourner la valeur initiale
      console.error(error);
      return initialValue;
    }
  });

  // Définir une fonction pour mettre à jour la valeur stockée dans le localStorage et dans l'état local
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permettre à la valeur d'être une fonction pour avoir la même API que useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Mise à jour de l'état local
      setStoredValue(valueToStore);
      // Mise à jour du localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // Gérer l'erreur, par exemple en affichant un message d'erreur dans la console
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;
