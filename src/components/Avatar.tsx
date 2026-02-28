import { useCallback, useRef } from "react";
import { useAvatarStore } from "../store/avatarStore";
import {
  generateImage,
  buildAvatarPrompt,
  detectMoodFromResponse,
} from "../ai/falClient";

interface AvatarProps {
  falApiKey: string;
}

export function Avatar(_props: AvatarProps) {
  const { currentImageUrl, currentMood, isGenerating } = useAvatarStore();

  return (
    <div className="avatar-container flex items-center gap-3">
      <div className="avatar-frame relative">
        {currentImageUrl ? (
          <img
            src={currentImageUrl}
            alt={`Companion — ${currentMood}`}
            className="avatar-img"
          />
        ) : (
          <div className="avatar-placeholder">
            <div className="avatar-glyph">✦</div>
          </div>
        )}
        {isGenerating && (
          <div className="avatar-loading">
            <div className="avatar-spinner" />
          </div>
        )}
        <div className={`avatar-mood-ring mood-${currentMood}`} />
      </div>
    </div>
  );
}

/**
 * Hook to trigger avatar generation from chat responses.
 * Call this after an AI response completes to update the avatar.
 */
export function useAvatarUpdate() {
  const { setImage, setGenerating, setMood, setError } =
    useAvatarStore();

  // Use ref for throttle timestamp to avoid stale closure issue
  const lastGeneratedRef = useRef<number>(0);
  const generatingRef = useRef(false);

  const updateAvatar = useCallback(
    async (responseText: string, falApiKey: string) => {
      if (!falApiKey) return;

      // Guard: skip if already generating (prevents race conditions)
      if (generatingRef.current) return;

      const mood = detectMoodFromResponse(responseText);
      setMood(mood);

      // Throttle: don't regenerate more than once per 30 seconds
      const elapsed = Date.now() - lastGeneratedRef.current;
      if (elapsed < 30000) return;

      generatingRef.current = true;
      setGenerating(true);
      try {
        const prompt = buildAvatarPrompt(mood);
        const result = await generateImage(prompt, falApiKey, {
          width: 256,
          height: 256,
          numInferenceSteps: 4,
        });
        setImage(result.url, mood);
        lastGeneratedRef.current = Date.now();
      } catch (err) {
        console.error("Avatar generation failed:", err);
        setError(err instanceof Error ? err.message : "Avatar generation failed");
      } finally {
        generatingRef.current = false;
      }
    },
    [setImage, setGenerating, setMood, setError]
  );

  return { updateAvatar };
}
