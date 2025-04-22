import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listDesignations } from "../actions/doctorActions";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useNavigate } from "react-router-dom";
import * as Icons from "react-icons/fa"; // Import all Font Awesome icons

const DesignationList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const designationList = useSelector((state) => state.designationList);
  const { loading, error, designations } = designationList;

  useEffect(() => {
    dispatch(listDesignations());
  }, [dispatch]);

  const handleDesignationClick = (slug) => {
    navigate(`/doctors?designation=${slug}`);
  };

  // Function to dynamically get the icon component
  // Function to dynamically get the icon component with proper casing
  const getIconComponent = (iconName) => {
    if (!iconName) return null;
    // Convert "faHeartbeat" to "FaHeartbeat"
    const formattedIconName = "Fa" + iconName.substring(2);
    const IconComponent = Icons[formattedIconName];
    return IconComponent ? (
      <IconComponent className="text-[#4A8BBE] text-4xl mb-2" />
    ) : null;
  };

  return (
    <section className="container mx-auto mt-10 p-3">
      <h2 className="text-3xl font-bold text-[#4A8BBE] text-center mb-6">
        Browse by Designation
      </h2>
      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="px-6">
          <Swiper
            slidesPerView={2}
            spaceBetween={20}
            freeMode={true}
            navigation={true}
            pagination={{ clickable: true }}
            breakpoints={{
              480: { slidesPerView: 2 },
              640: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 5 },
              1280: { slidesPerView: 6 },
            }}
            modules={[FreeMode, Navigation, Pagination]}
            className="mySwiper"
          >
            {designations.map((designation) => (
              <SwiperSlide key={designation.id}>
                <div
                  className="bg-white p-4 shadow-lg rounded-xl flex flex-col items-center justify-center w-48 h-24 
                             hover:shadow-xl transition duration-300 cursor-pointer"
                  onClick={() => handleDesignationClick(designation.slug)}
                >
                  {getIconComponent(designation.icon)}
                  <span className="text-sm font-medium text-center">
                    {designation.name}
                  </span>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="mt-8"></div>
        </div>
      )}
    </section>
  );
};

export default DesignationList;
