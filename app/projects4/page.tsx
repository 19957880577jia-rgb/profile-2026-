import ProjectDetailPage from "@/components/ProjectDetailPage";

export default function Projects4Page() {
  return (
    <ProjectDetailPage
      title="RunGlim里程微光"
      images={["/project4/project4.png"]}
      videoLayers={[
        {
          src: "/project4/website%20demo.mp4",
          left: 0,
          top: 74.1812,
          width: 100,
          height: 12.4986,
        },
      ]}
    />
  );
}
