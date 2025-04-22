import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listSpecializations } from "../actions/doctorActions";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useNavigate, useLocation } from "react-router-dom";
import * as Icons from "react-icons/fa";

const SpecializationList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const specializationList = useSelector((state) => state.specializationList);
  const { loading, error, specializations } = specializationList;

  useEffect(() => {
    dispatch(listSpecializations());
  }, [dispatch]);

  // Handle Filter Clicks
  const handleSpecializationClick = (slug) => {
    const params = new URLSearchParams(location.search);
    if (slug) {
      params.set("specialization", slug);
    } else {
      params.delete("specialization");
    }
    navigate(`/doctors?${params.toString()}`);
  };

  // Function to dynamically get the icon component with proper casing
  const getIconComponent = (iconName) => {
    if (!iconName)
      return <Icons.FaStethoscope className="text-[#4A8BBE] text-4xl mb-2" />;
    const formattedIconName = "Fa" + iconName.substring(2);
    const IconComponent = Icons[formattedIconName];
    return IconComponent ? (
      <IconComponent className="text-[#4A8BBE] text-4xl mb-2" />
    ) : (
      <Icons.FaStethoscope className="text-[#4A8BBE] text-4xl mb-2" />
    );
  };

  return (
    <section className="container mx-auto mt-10 p-3">
      <h2 className="text-3xl font-bold text-[#4A8BBE] text-center mb-6">
        Browse by Specialization
      </h2>
      {loading ? (
        <p className="text-center">Loading...</p>
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
            {specializations.map((specialization) => (
              <SwiperSlide key={specialization.id}>
                <div
                  className="bg-white p-4 shadow-lg rounded-xl flex flex-col items-center justify-center w-48 h-24 
                             hover:shadow-xl transition duration-300 cursor-pointer"
                  onClick={() => handleSpecializationClick(specialization.slug)}
                  aria-label={`Filter by ${specialization.name}`}
                >
                  {getIconComponent(specialization.icon)}
                  <span className="text-sm font-medium text-center">
                    {specialization.name}
                  </span>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </section>
  );
};

export default SpecializationList;
