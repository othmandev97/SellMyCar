import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
export const useAuthStatus = () => {
  const [loggedIn, setLggedIn] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLggedIn(true);
      }
      setCheckingStatus(false);
    });
  });

  return { loggedIn, checkingStatus };
};
