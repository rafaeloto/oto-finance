"use client";

import { useProgress } from "@hooks/useProgress";
import { ReactNode, createContext, useContext } from "react";
import { animated } from "@react-spring/web";

export const ProgressBarContext = createContext<ReturnType<
  typeof useProgress
> | null>(null);

export function useProgressBar() {
  const progress = useContext(ProgressBarContext);

  if (progress === null) {
    throw new Error("Can only be used within <ProgressBar>");
  }

  return progress;
}

const ProgressBarContainer = ({
  children,
  isVisible,
}: {
  children: ReactNode;
  isVisible: boolean;
}) => {
  return (
    <div
      className={`z-9999999 fixed left-0 top-0 h-[2px] w-full overflow-hidden bg-transparent ${isVisible ? "visible" : "hidden"}`}
    >
      {children}
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ProgressBarFiller = ({ style }: { style: any }) => {
  return <animated.div className="h-full bg-primary" style={style} />;
};

export function ProgressBar({ children }: { children: ReactNode }) {
  const progress = useProgress();
  return (
    <ProgressBarContext.Provider value={progress}>
      <ProgressBarContainer
        isVisible={
          progress.state !== "initial" && progress.state !== "complete"
        }
      >
        <ProgressBarFiller style={progress.props} />
      </ProgressBarContainer>
      {children}
    </ProgressBarContext.Provider>
  );
}
