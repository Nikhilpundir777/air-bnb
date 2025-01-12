import {useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import Image from "../Image.jsx";

export default function IndexPage() {
  // const [places,setPlaces] = useState([]);
  // useEffect(() => {
  //   axios.get('/places').then(response => {
  //     setPlaces(response.data);
  //   });
  // }, []);

  const mockProperties = [
    {
      id: "1",
      title: "Luxury Villa in Goa",
      location: "Anjuna, Goa",
      price: 15000,
      rating: 4.98,
      images: [
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2075&q=80",
      ],
    },
    {
      id: "2",
      title: "Modern Apartment in Mumbai",
      location: "Bandra West, Mumbai",
      price: 8000,
      rating: 4.85,
      images: [
        "https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      ],
    },
    {
      id: "3",
      title: "Heritage Haveli in Jaipur",
      location: "Old City, Jaipur",
      price: 12000,
      rating: 4.92,
      images: [
        "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2065&q=80",
      ],
    },
    {
      id: "4",
      title: "Beachfront Villa in Kerala",
      location: "Varkala, Kerala",
      price: 20000,
      rating: 4.89,
      images: [
        "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      ],
    },
    {
      id: "5",
      title: "Penthouse in Bengaluru",
      location: "Koramangala, Bengaluru",
      price: 25000,
      rating: 4.95,
      images: [
        "https://plus.unsplash.com/premium_photo-1689609950112-d66095626efb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aG91c2VzfGVufDB8fDB8fHww",
      ],
    },
    {
      id: "6",
      title: "Rustic Cottage in Coorg",
      location: "Madikeri, Coorg",
      price: 6500,
      rating: 4.78,
      images: [
        "https://images.unsplash.com/photo-1704079347678-49250723fa6f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNvb3JnfGVufDB8fDB8fHww"
      ],
    },
    {
      id: "7",
      title: "Luxury Yacht in Mumbai",
      location: "Marine Drive, Mumbai",
      price: 50000,
      rating: 5.0,
      images: [
       "https://plus.unsplash.com/premium_photo-1661963239507-7bdf41a5e66b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bHV4dXJ5JTIweWFjaHQlMjByb29tfGVufDB8fDB8fHww",
      ],
    },
    {
      id: "8",
      title: "Countryside Farmhouse in Punjab",
      location: "Amritsar, Punjab",
      price: 10000,
      rating: 4.80,
      images: [
        "https://plus.unsplash.com/premium_photo-1684175656320-5c3f701c082c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YXBhcnRtZW50fGVufDB8fDB8fHww"
      ],
    },
    {
      id: "9",
      title: "Eco-Resort in Rishikesh",
      location: "Rishikesh, Uttarakhand",
      price: 8500,
      rating: 4.91,
      images: [
        "https://plus.unsplash.com/premium_photo-1732745286365-7e2b60a9b0b4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cmlzaGlrZXNoJTIwaG9tZXxlbnwwfHwwfHx8MA%3D%3D",
      ],
    },
    {
      id: "10",
      title: "Designer Loft in Chennai",
      location: "T. Nagar, Chennai",
      price: 11000,
      rating: 4.87,
      images: [
        "https://images.unsplash.com/photo-1658291361853-699f5a4c78f7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y2hlbm5haSUyMHJvb218ZW58MHx8MHx8fDA%3D"
      ],
    },
  ];
  


  const [places, setPlaces] = useState([]);

  // Using mock data instead of an API call for now
  useEffect(() => {
    // In place of actual API call, use the mock data
    setPlaces(mockProperties);
  }, []);

  return (
    <div className="mt-8 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
      {places.length > 0 &&
        places.map((place) => (
          <Link to={"/place/" + place.id} key={place.id}>
            <div className="bg-gray-500 mb-2 rounded-2xl flex">
              {place.images?.[0] && (
                <Image
                  className="rounded-2xl object-cover aspect-square"
                  src={place.images?.[0]}
                  alt={place.title}
                />
              )}
            </div>
            <h2 className="font-bold">{place.location}</h2>
            <h3 className="text-sm text-gray-500">{place.title}</h3>
            <div className="mt-1">
              <span className="font-bold">${place.price}</span> per night
            </div>
          </Link>
        ))}
    </div>
  );
}

