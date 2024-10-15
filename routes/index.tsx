import * as fal from "@fal-ai/serverless-client";
import { defineRoute } from "$fresh/server.ts";
import { assert } from "$std/assert/assert.ts";

const generateImageWithFal = async ({
  prompt,
  negativePrompt,
}: {
  prompt: string;
  negativePrompt?: string;
}) => {
  assert(Deno.env.get("FAL_API_KEY"), "Missing FAL_API_KEY");
  fal.config({
    credentials: Deno.env.get("FAL_API_KEY"),
  });

  const result: {
    images: { url: string }[];
    timings: { inference: number };
  } = await fal.subscribe("fal-ai/fast-lightning-sdxl", {
    input: {
      prompt,
      negative_prompt:
        negativePrompt || "ugly, deformed, noisy, blurry, bad anatomy",
      enable_safety_checker: true,
      sync_mode: true,
      image_size: "square_hd",
      num_inference_steps: 4,
      num_images: 1,
      expand_prompt: false,
      format: "jpeg",
    },
  });

  const image = result.images[0].url;
  return {
    url: image,
    format: "jpeg",
  };
};

const dogMemeBottomText = [
  "I have no idea what I am doing",
  "When you open the oven to check on cookies",
  "This is fine",
  "Such wow, much amaze",
  "What if I never find out who’s a good boy?",
  "I’m not a regular dog, I’m a cool dog",
  "When you realize today is Monday",
  "Boops the snoot",
  "Being this cute should be illegal",
  "Did somebody say walk?",
  "Pretending to listen",
  "Zoomies incoming",
  "When you sing the song of your people",
  "I can haz treat?",
  "The face you make when someone farts",
  "You said ball?!",
  "Smiles in canine",
  "When you’re the family dog and everything’s falling apart",
  "Is putting up with human antics",
  "Time for another nap!",
  "I work hard so my dog can have a better life",
  "When you hear the word “vet”",
  "If it fits, I sits",
  "I can’t adult today",
  "Current mood: derp",
  "Work from home supervisor",
  "Caught stealing food? Deny everything!",
  "Can we not chase the mailman today?",
  "Living my best dog life",
  "Diaper patrol failed again",
  "Mom’s trying a new recipe, so I’m guarding the phone ready for takeout",
  "Oops did I do that?",
  "Who needs an alarm clock with me around?",
  "Will fetch for belly rubs",
  "Smelled a comunism and ate it",
  "The end is near but the treats are too",
  "Barked at Alexa",
  "Didn’t choose the pug life, the pug life chose me",
  "Let me in charge, I’ll howl like it matters",
];

export default defineRoute(async (_req, _ctx) => {
  const { url } = await generateImageWithFal({
    prompt: "fish eye lens photo of a dog sniffing the lens",
  });

  return (
    <div
      class="relative w-screen h-screen bg-center bg-cover"
      style={{
        "background-image": `url('${url}');`,
      }}
    >
      <div class="text-shadow bottom-8 absolute left-0 right-0 p-4 text-5xl font-extrabold text-center text-white uppercase">
        {
          dogMemeBottomText[
            Math.floor(Math.random() * dogMemeBottomText.length)
          ]
        }
      </div>
    </div>
  );
});
