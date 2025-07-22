import Hero from "@/components/Carousel";
import Categories from "@/components/Categories";
import EventList from "@/components/EventList";
import Testimonials from "@/components/Testimonials";


export default function Home() {


  return (
    <>
      <Hero />
      <Categories />
      <EventList defaultCity="Mumbai" />
      <Testimonials />
      
      {/* Display user count or error - commented out */}
    </>
  );
}
