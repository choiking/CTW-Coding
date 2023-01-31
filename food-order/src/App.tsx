import React from 'react';
import './App.css';


function App() {
  const [selectedStep, setStep] = React.useState("step1");
  const [selectedMeal, setSelectedMeal] = React.useState("breakfast");
  const [selectedPeople, setSelectedPeople] = React.useState(1);
  const [mealToRestaurants, setMealToRestaurants] = React.useState({"breakfast": new Set<string>(), "lunch": new Set<string>(), "dinner": new Set<string>()});
  const [selectedRestaurant, setSelectedRestaurant] = React.useState(mealToRestaurants["breakfast"].values().next().value);
  const [restaurantToDishes, setRestaurantToDishes] = React.useState<RestaurantToDishesType>({});
  const [selectedDishes, setSelectedDishes] = React.useState<SelectedDish[]>([{"dishName": restaurantToDishes[selectedRestaurant]?.values().next().value.name, "numServings": 1}]);
  const handleAddDish = () => {
    setSelectedDishes([...selectedDishes, { dishName: restaurantToDishes[selectedRestaurant].values().next().value.name, numServings: 1 }]);
  };
  
  const handleDishChange = (index: number, dishName: string) => {
    const newSelectedDishes = [...selectedDishes];
    newSelectedDishes[index].dishName = dishName;
    setSelectedDishes(newSelectedDishes);


    console.log(selectedDishes);
  };
  
  const handleServingsChange = (index: number, numServings: number) => {
    const newSelectedDishes = [...selectedDishes];
    newSelectedDishes[index].numServings = numServings;
    setSelectedDishes(newSelectedDishes);

    console.log(selectedDishes);
  };

  interface NewDishProps {
    selectedDish: SelectedDish
    index: number
  }

  const numServings = [1,2,3,4,5]

  const NewDish: React.FC<NewDishProps> = ({selectedDish, index}) => {
    return (
      <div key={index}>
         <p>Please Select a Dish</p>
            <select onChange={(e: any) => handleDishChange(index, e.target.value)} defaultValue={selectedDish.dishName}>
                {Array.from(restaurantToDishes[selectedRestaurant] || [])?.map((dish: Dish) => {
                    return <option value={dish.name}>{dish.name}</option>
                })}
            </select>

            <p>Please select number of servings for the dish</p>
            <select onChange={(e: any) => handleServingsChange(index, e.target.value)} defaultValue={selectedDish.numServings}>
                {numServings.map((num) => {
                  return <option value={num}>{num}</option>
                })}
            </select>
      </div>
    );
  };
interface SelectedDish {
  dishName: string;
  numServings: number;
}


  type Dish = {
    id: number;
    name: string;
    restaurant: string,
    availableMeals: string[];
  };

  type MealType = "breakfast" | "lunch" | "dinner"

  const fetchDishes = async () => {
    try {
      const response = await fetch("https://raw.githubusercontent.com/G123-jp/react_assignment/master/data/dishes.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const dishesData = await response.json();
      return dishesData.dishes;
    } catch (error) {
      console.error(error);
      return [];
    }
  };
  
  const [dishesData, setDishesData] = React.useState<Dish[]>([]);
  
  React.useEffect(() => {
    fetchDishes().then(setDishesData);
  }, []);
  
interface RestaurantToDishesType {
    [key: string]: Set<Dish>;
  }

  React.useEffect(() => {
      if (!dishesData) return;

      const newMealToRestaurants = {"breakfast": new Set<string>(), "lunch": new Set<string>(), "dinner": new Set<string>()};

      dishesData.forEach((dish) => {
        dish.availableMeals?.forEach((meal) => {
          newMealToRestaurants[meal as MealType]?.add(dish.restaurant);
        })
      })

      setMealToRestaurants(newMealToRestaurants);

      const newRestaurantToDishes: RestaurantToDishesType = {};
      dishesData.forEach((dish) => {
        if (!newRestaurantToDishes[dish.restaurant]) {
          newRestaurantToDishes[dish.restaurant] = new Set([dish]);
        } else {
          newRestaurantToDishes[dish.restaurant].add(dish);
        }
      })

      setRestaurantToDishes(newRestaurantToDishes);

  }, [dishesData])


  React.useEffect((
  ) => {
    document.getElementById("step1")?.classList.remove("selected");
    document.getElementById("step2")?.classList.remove("selected");
    document.getElementById("step3")?.classList.remove("selected");
    document.getElementById("step4")?.classList.remove("selected");
    document.getElementById("review")?.classList.remove("selected");

    document.getElementById(selectedStep)?.classList.add("selected");
  }, [selectedStep]);

  const people = [1,2,3,4,5,6,7,8,9,10];

  return (
    <>
    <div className="tab">
      <button className="tablinks" onClick={() => setStep('step1')}>Step1</button>
      <button className="tablinks" onClick={() => setStep('step2')}>Step2</button>
      <button className="tablinks" onClick={() => setStep('step3')}>Step3</button>
      <button className="tablinks" onClick={() => setStep('review')}>Review</button>
    </div>
    <div id="step1" className='step'>
        <p>Please Select a Meal</p>
          <select onChange={(e: any) => {setSelectedMeal(e.target.value);}}>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
          </select>
        <p>Please Enter Number of People</p>
          <select onChange={(e: any) => {setSelectedPeople(e.target.value);}}>
            {people.map((i) => {
              return <option value={i}>{i}</option>
            })}
          </select>
    </div>
    <div id="step2" className='step'>
        <p>Please Select a Restaurant</p>
          <select onChange={(e: any) => {setSelectedRestaurant(e.target.value);}}>
            {Array.from(mealToRestaurants[selectedMeal as MealType] || [])?.map((restaurant:any) => {
              return <option value={restaurant}>{restaurant}</option>
            })}
          </select>

        <button onClick={() => setStep('step1')}>Previous</button>  
    </div>
    <div id="step3" className='step'>
    {selectedDishes.map((selectedDish, index) => (
      <NewDish selectedDish={selectedDish} index={index} />
    ))}
    <button onClick={handleAddDish}>Add Dish</button>
        <button onClick={() => setStep('step2')}>Previous</button>  
    </div>
    <div id="review" className='step'>
      <p><b>Meal:</b>   <b>{selectedMeal}</b></p>
      <p><b>No. of. People</b>   <b>{selectedPeople}</b></p>
      <div>
        <b>Dishes</b>
        {selectedDishes.map((dish: SelectedDish) => {
          return <p>{dish.dishName} : {dish.numServings}</p>
        })}
      </div>
      <button onClick={() => setStep('step3')}>Previous</button>  
    </div>
    </>
  );
}

export default App;
