// [SEED] Added: Seed the client's Perspective Circle survey into local storage via surveyRepo.

import type { SurveyBlueprint } from "../domain/types";
import { surveyRepo } from "../data/surveyRepo";

import type { SurveyBlueprint } from "../domain/types";

export const presenceAwarenessSurvey: SurveyBlueprint = {
  surveyId: "s_presence_awareness_v1",
  version: 1,

  title: "Presence & Awareness Assessment",
  description:
    "A self-reflection tool exploring awareness, motivation, flow, and transcendence.",

  scale: { min: 1, max: 7, step: 1 },

  categories: [
    { categoryId: "c_detached_awareness", label: "Detached Awareness" },
    { categoryId: "c_dopamine_awareness", label: "Dopamine Awareness" },
    { categoryId: "c_flow", label: "Absorbed Engagement (Flow)" },
    { categoryId: "c_transcendence", label: "Transcendence" },
    { categoryId: "c_overall_presence", label: "Overall Presence & Awareness" },
  ],

  prompts: [
    /* ------------------------------------------------------------
     * 👁️ Detached awareness / meta-observation
     * ------------------------------------------------------------ */
    {
      promptId: "da_1",
      categoryId: "c_detached_awareness",
      text: "I can easily notice when my mind starts wandering without getting caught up in the thoughts",
    },
    {
      promptId: "da_2",
      categoryId: "c_detached_awareness",
      text: "When strong emotions arise I can step back and observe them instead of being swept away",
    },
    {
      promptId: "da_3",
      categoryId: "c_detached_awareness",
      text: "I often catch myself on autopilot (eating, driving, or scrolling without really being present)",
    },
    {
      promptId: "da_4",
      categoryId: "c_detached_awareness",
      text: "I regularly pause during the day to simply notice what is happening inside me (thoughts, feelings, body)",
    },
    {
      promptId: "da_5",
      categoryId: "c_detached_awareness",
      text: "Even in stressful situations I can maintain a part of me that watches the experience calmly",
    },

    /* ------------------------------------------------------------
     * 🍬 Dopamine awareness / reward & motivation tracking
     * ------------------------------------------------------------ */
    {
      promptId: "dop_1",
      categoryId: "c_dopamine_awareness",
      text: "I can clearly tell the difference between activities that give me a quick thrill and those that feel deeply meaningful",
    },
    {
      promptId: "dop_2",
      categoryId: "c_dopamine_awareness",
      text: "I often chase short-term dopamine hits (likes, sugar, scrolling) even when I know they won’t satisfy me long-term",
    },
    {
      promptId: "dop_3",
      categoryId: "c_dopamine_awareness",
      text: "I notice when I’m avoiding important but low-reward tasks because they feel boring",
    },
    {
      promptId: "dop_4",
      categoryId: "c_dopamine_awareness",
      text: "I regularly reflect on what truly motivates me versus what just gives me a temporary buzz",
    },
    {
      promptId: "dop_5",
      categoryId: "c_dopamine_awareness",
      text: "I can sense when my actions are driven by genuine desire rather than a craving for instant gratification",
    },

    /* ------------------------------------------------------------
     * ⚡ Absorbed engagement / flow
     * ------------------------------------------------------------ */
    {
      promptId: "flow_1",
      categoryId: "c_flow",
      text: "I frequently become completely absorbed in activities so that time seems to disappear",
    },
    {
      promptId: "flow_2",
      categoryId: "c_flow",
      text: "When I’m working on something I care about I often lose awareness of myself and my surroundings",
    },
    {
      promptId: "flow_3",
      categoryId: "c_flow",
      text: "It’s hard for me to get fully immersed in tasks because my mind keeps wandering",
    },
    {
      promptId: "flow_4",
      categoryId: "c_flow",
      text: "I regularly experience moments where everything feels effortless and I’m in the zone",
    },
    {
      promptId: "flow_5",
      categoryId: "c_flow",
      text: "I find it easy to lose myself in creative or challenging activities that match my skills",
    },

    /* ------------------------------------------------------------
     * ✨ Transcendence / spiritual connection
     * ------------------------------------------------------------ */
    {
      promptId: "tr_1",
      categoryId: "c_transcendence",
      text: "I often feel a deep sense of connection to something larger than myself (nature, humanity, the universe, the divine)",
    },
    {
      promptId: "tr_2",
      categoryId: "c_transcendence",
      text: "I frequently experience moments of awe, wonder, or peace that go beyond my personal concerns",
    },
    {
      promptId: "tr_3",
      categoryId: "c_transcendence",
      text: "My daily life usually feels separate from any sense of a bigger picture or spiritual meaning",
    },
    {
      promptId: "tr_4",
      categoryId: "c_transcendence",
      text: "I regularly have experiences that make me feel part of a greater whole",
    },
    {
      promptId: "tr_5",
      categoryId: "c_transcendence",
      text: "I feel spiritually connected or touched by beauty or sacredness more often than not",
    },

    /* ------------------------------------------------------------
     * 🌱 Overall presence & awareness
     * ------------------------------------------------------------ */
    {
      promptId: "op_1",
      categoryId: "c_overall_presence",
      text: "Right now in my life I generally feel present and aware in most moments of the day",
    },
    {
      promptId: "op_2",
      categoryId: "c_overall_presence",
      text: "I often live with a clear, awake sense of being here in the present moment",
    },
    {
      promptId: "op_3",
      categoryId: "c_overall_presence",
      text: "Most of the time I feel disconnected from the present and caught up in my mind",
    },
  ],
};

export function seedPerspectiveCircleSurvey() {
  surveyRepo.save(presenceAwarenessSurvey);
  return presenceAwarenessSurvey.surveyId;
}
