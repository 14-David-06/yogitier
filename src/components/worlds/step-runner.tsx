"use client";

import type { ReactNode } from "react";

import { BreathPlayer } from "@/components/meditation/breath-player";
import { LessonPlayer } from "@/components/player/lesson-player";
import { animalsById } from "@/content/animals";
import { getBreath } from "@/content/breathing";
import { getPose } from "@/content/poses";
import type { Step, World } from "@/lib/studio/types";

import { InfoView, MissionView, QuizView, StepShell, TimerView, VideoView } from "./step-views";

/** Spielt eine Station einer Lernwelt ab. `onDone` = geschafft, `onClose` = abgebrochen/fertig. */
export function StepRunner({ world, step, onDone, onClose }: { world: World; step: Step; onDone: () => void; onClose: () => void }) {
  const index = world.steps.findIndex((s) => s.id === step.id);
  const total = world.steps.length;
  const shell = (content: ReactNode, footer?: ReactNode) => (
    <StepShell world={world} index={index} total={total} title={step.title} onClose={onClose} footer={footer}>
      {content}
    </StepShell>
  );
  const finish = () => {
    onDone();
    onClose();
  };

  switch (step.type) {
    case "info":
      return <InfoView world={world} step={step} onDone={finish} shell={shell} />;
    case "video":
      return <VideoView world={world} step={step} onDone={finish} shell={shell} />;
    case "quiz":
      return <QuizView world={world} step={step} onDone={finish} shell={shell} />;
    case "timer":
      return <TimerView world={world} step={step} onDone={finish} shell={shell} />;
    case "aufgabe":
      return <MissionView world={world} step={step} onDone={finish} onLater={onClose} shell={shell} />;
    case "uebung": {
      const pose = getPose(step.pose);
      if (!pose) return shell(<p className="py-10 text-center text-ink-soft">Diese Übung gibt es nicht mehr.</p>);
      return (
        <LessonPlayer
          title={step.title}
          host={animalsById[world.guide]}
          color={pose.color}
          steps={[{ pose, seconds: step.seconds, cue: step.cue || pose.steps.slice(0, 2).join(" ") }]}
          outro={pose.benefit}
          activity={{ type: "uebung", refId: pose.slug, title: pose.name }}
          onComplete={onDone}
          onClose={onClose}
        />
      );
    }
    case "atmung": {
      const breath = getBreath(step.breath);
      if (!breath) return shell(<p className="py-10 text-center text-ink-soft">Diese Atemübung gibt es nicht mehr.</p>);
      return <BreathPlayer breath={breath} onComplete={onDone} onClose={onClose} />;
    }
  }
}
