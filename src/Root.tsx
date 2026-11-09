import { Composition, Still } from "remotion";
import { Banner } from "./promo/Banner";
import { FreshCoP1, FC1_TOTAL } from "./stories/freshco/FreshCoP1";
import { FreshCoP2B, FC2B_TOTAL } from "./stories/freshco/FreshCoP2B";
import { LastTrainP1, LT1_TOTAL } from "./stories/last-train/LastTrainP1";
import { LastTrainP2B, LT2B_TOTAL } from "./stories/last-train/LastTrainP2B";
import { LastTrainP3A, LT3A_TOTAL } from "./stories/last-train/LastTrainP3A";
import { LastTrainP3B, LT3B_TOTAL } from "./stories/last-train/LastTrainP3B";

/** Every episode is a 1080x1920 (9:16) composition at 30 fps. Add new episodes here. */
const SHORT = { fps: 30, width: 1080, height: 1920 } as const;

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="LastTrain-P1" component={LastTrainP1} durationInFrames={LT1_TOTAL} {...SHORT} />
    <Composition id="LastTrain-P2B" component={LastTrainP2B} durationInFrames={LT2B_TOTAL} {...SHORT} />
    <Composition id="LastTrain-P3A" component={LastTrainP3A} durationInFrames={LT3A_TOTAL} {...SHORT} />
    <Composition id="LastTrain-P3B" component={LastTrainP3B} durationInFrames={LT3B_TOTAL} {...SHORT} />
    <Composition id="FreshCo-P1" component={FreshCoP1} durationInFrames={FC1_TOTAL} {...SHORT} />
    <Composition id="FreshCo-P2B" component={FreshCoP2B} durationInFrames={FC2B_TOTAL} {...SHORT} />
    <Still id="Banner" component={Banner} width={1280} height={640} />
  </>
);
