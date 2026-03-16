/**
 * Autonomy Engine
 *
 * React hook that runs the Goal-Driven Autonomy evaluation loop.
 * - Evaluates on mount
 * - Re-evaluates every 30 minutes
 * - Also fires on "dj-autonomy-review" custom event (triggered by chat command)
 *
 * Safety: this engine NEVER modifies user data — it only dispatches suggestions.
 */

import { useEffect, useRef } from "react";
import { useActor } from "../../hooks/useActor";
import { useMemories, useTasks } from "../../hooks/useQueries";
import { getPlans } from "../planner/planStore";
import {
  dispatchEvaluationResults,
  evaluateAutonomy,
} from "./autonomyEvaluator";

const EVALUATION_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes

export function useAutonomyEngine(): void {
  const { actor } = useActor();
  const { data: tasks = [] } = useTasks();
  const { data: memories = [] } = useMemories();

  // Keep refs to avoid stale closures in interval/event handler
  const actorRef = useRef(actor);
  const tasksRef = useRef(tasks);
  const memoriesRef = useRef(memories);

  useEffect(() => {
    actorRef.current = actor;
  }, [actor]);

  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  useEffect(() => {
    memoriesRef.current = memories;
  }, [memories]);

  useEffect(() => {
    async function runEvaluation() {
      let plans: any[] = [];
      if (actorRef.current) {
        try {
          plans = await getPlans(actorRef.current);
        } catch {
          plans = [];
        }
      }

      const suggestions = evaluateAutonomy({
        plans,
        tasks: tasksRef.current,
        memories: memoriesRef.current,
      });

      dispatchEvaluationResults(suggestions);
    }

    // Run immediately on mount
    runEvaluation();

    // Schedule every 30 minutes
    const intervalId = setInterval(runEvaluation, EVALUATION_INTERVAL_MS);

    // Listen for immediate evaluation trigger from chat commands
    function handleAutonomyReview() {
      runEvaluation();
    }
    window.addEventListener("dj-autonomy-review", handleAutonomyReview);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("dj-autonomy-review", handleAutonomyReview);
    };
  }, []); // only run setup once; refs keep values fresh
}
