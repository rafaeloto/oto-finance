import { useEffect, useRef, useState } from "react";
import { useSpring } from "@react-spring/web";

export function useProgress() {
  const [state, setState] = useState<
    "initial" | "in-progress" | "completing" | "complete"
  >("initial");
  const [springValue, setSpringValue] = useState(0);

  const props = useSpring({
    width: `${springValue}%`,
    from: { width: "0%" },
    to: { width: `${springValue}%` },
    loop: false,
    onRest: () => {
      if (springValue === 100) {
        setTimeout(() => setState("initial"), 500);
      }
    },
  });

  useInterval(
    () => {
      let diff: number;
      if (springValue === 0) {
        diff = 37.5;
      } else if (springValue < 50) {
        diff = rand(2.5, 25);
      } else {
        diff = rand(2.5, 12.5);
      }

      setSpringValue(Math.min(springValue + diff, 99));
    },
    state === "in-progress" ? 300 : null,
  );

  useEffect(() => {
    if (state === "initial") {
      setSpringValue(0);
    } else if (state === "completing") {
      setSpringValue(100);
    }

    if (springValue === 100) {
      setState("complete");
    }
  }, [springValue, state]);

  function reset() {
    setState("initial");
  }

  function start() {
    setState("in-progress");
  }

  function done() {
    setState((state) =>
      state === "initial" || state === "in-progress" ? "completing" : state,
    );
  }

  return { state, props, start, done, reset };
}

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    if (delay !== null) {
      tick();
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
