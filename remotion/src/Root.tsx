import { Composition, Folder } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { SfxDemo } from "./SfxDemo";
import { KALLPA_REEL, KallpaReel } from "./videos/KallpaReel";
import { KALPA_SCENES } from "./videos/kalpa/scenes";
import { KALPA_PROCESO_REEL, KalpaProcesoReel } from "./videos/kalpa/KalpaProcesoReel";
import { CarouselScene, CarouselStory, KALLPA_PROCESO_CAROUSEL } from "./videos/KallpaProceso";
import { Logo } from "./HelloWorld/Logo";
import { Title } from "./HelloWorld/Title";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Elements">
        <Composition
          id="Logo"
          component={Logo}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            logoColor1: "#91EAE4",
            logoColor2: "#86A8E7",
          }}
        />
        <Composition
          id="Title"
          component={Title}
          durationInFrames={115}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            titleText: "Welcome to Remotion",
            titleColor: "#000000",
          }}
        />
      </Folder>
      <Composition
        // You can take the "id" to render a video:
        // bunx remotion render HelloWorld
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        // You can override these props for each render:
        // https://www.remotion.dev/docs/parametrized-rendering
        defaultProps={{
          titleText: "Welcome to Remotion",
          titleColor: "#000000",
        }}
      />

      <Folder name="kalpa-electricidad">
        <Composition id="KalpaProcesoReel" component={KalpaProcesoReel} {...KALPA_PROCESO_REEL} />
        {KALPA_SCENES.map((s) => (
          <Composition key={s.id} id={s.id} component={s.component} fps={30} width={1080} height={1920} durationInFrames={90} />
        ))}
      </Folder>
      <Folder name="Reels">
        <Composition id="KallpaReel" component={KallpaReel} {...KALLPA_REEL} />
        <Composition id="KallpaProceso-Carrusel" component={CarouselScene} {...KALLPA_PROCESO_CAROUSEL} />
        <Composition id="KallpaProceso-Girar" component={CarouselStory} {...KALLPA_PROCESO_CAROUSEL} durationInFrames={96} />
      </Folder>
      <Composition
        id="SfxDemo"
        component={SfxDemo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
