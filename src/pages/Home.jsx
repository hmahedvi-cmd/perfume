import Hero from "../component/Hero/Hero";
import Newsletter from "../component/NewsLetter/NewsLetter";
import FeaturedProducts from "../sections/FeaturedProducts";

function Home() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <Newsletter />
    </>
  );
}

export default Home;
