
import Nav from "../(navbar)/page";
import LeftContainer from "@/app/components/LeftContainer";
import MiddleContainer from "@/app/components/MiddleContainer";

export default function Layout() {

  return (
    <div className="p-2 bg-white flex pr-4">
      <div className="bg-gray-200 w-full h-[95vh] overflow-hidden rounded-lg flex">
        <Nav />
        <div className="w-[25vw] bg-gray-200 flex flex-col">
          <LeftContainer  />
        </div>
        <div className="bg-black w-[0.5px] h-[95vh]"></div>
        <div className="w-[63vw] bg-gray-200 h-[95vh] flex flex-col">
          <MiddleContainer />
        </div>
      </div>
    </div>
  );
}
