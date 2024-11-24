import Slot from "../models/slot.model.js";
import Holiday from "../models/holiday.model.js";
import moment from "moment";
import { adjustDateToNepalTimezone } from "./helper.utils.js";

export const generateSlots = async (venue, date) => {
    const openingTime = moment(date).set({
      hour: parseInt(venue.opensAt.split(":")[0]),
      minute: parseInt(venue.opensAt.split(":")[1]),
    });
  
    const closingTime = moment(date).set({
      hour: parseInt(venue.closesAt.split(":")[0]),
      minute: parseInt(venue.closesAt.split(":")[1]),
    });
  
    const slots = [];
  
    let currentTime = openingTime.clone();
  
    while (currentTime.isBefore(closingTime)) {
      const endTime = currentTime.clone().add(1, "hours"); // Slot duration is 1 hour
      if (endTime.isAfter(closingTime)) break; // Prevent slots that go beyond closing time
  
      let basePrice = 1000; // Default base price
      let dynamicPrice = basePrice;
  
      // Adjust price based on time of day
      const hour = currentTime.hours();
      if (hour > 12 && hour < 17) {
        dynamicPrice *= 1.2; // Cheaper in the morning
      } else if (hour >= 17) {
        dynamicPrice *= 1.5; // More expensive in the evening
      }
  
      // Check if the date is a weekend or holiday, and adjust pricing accordingly
      const isHolidayToday = await isHoliday(venue._id, date);
      const isWeekendToday = await isWeekend(date);
      if (isWeekendToday || isHolidayToday) {
        basePrice = 1200
        dynamicPrice = basePrice
        // dynamicPrice *= 1.2; // Add 20% premium on weekends/holidays
        if (hour > 12 && hour < 17) {
          dynamicPrice = 1400; // Cheaper in the morning
        } else if (hour >= 17) {
          dynamicPrice = 1700; // More expensive in the evening
        }
      }
      const formattedDate = adjustDateToNepalTimezone(date);
  
      // Create a slot object and push it to the array
      const slot = {
        venueId: venue._id,
        startTime: currentTime.format("HH:mm"),
        endTime: endTime.format("HH:mm"),
        date: formattedDate,
        basePrice,
        dynamicPrice,
        isWeekend: isWeekendToday,
        isHoliday: isHolidayToday,
      };
      slots.push(slot);
  
      // Move to the next time slot
      currentTime = endTime;
    }
  
    // Save generated slots to the database
    try {
      await Slot.insertMany(slots); // Batch save to the database
      console.log("Slots successfully generated for venue:", venue.name);
    } catch (error) {
      console.error("Error saving slots:", error);
    }
  
    return slots;
  };
  
  const isWeekend = async (date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
  };
  
  // const isHoliday = async (date) => {
  //   // const holidays = ["2024-01-01", "2024-10-03"]; // New Year, Christmas, etc.
  //   const holidays = await Holiday.find();
  //   const holidaysDate = holidays.map(holiday => holiday.date)
  //   const formattedDate = moment(date).format("YYYY-MM-DD");
  //   return holidaysDate.includes(formattedDate);
  // };
  
  
  const isHoliday = async (venueId, date) => {
    // const holidays = ["2024-01-01", "2024-10-03"]; // New Year, Christmas, etc.
    const holidays = await Holiday.find({venueId});
    const holidaysDate = holidays.map(holiday => holiday.date)
    const formattedDate = moment(date).format("YYYY-MM-DD");
    return holidaysDate.includes(formattedDate);
  };
  
  export const generateSlotsForWeek = async (venue) => {
    const today = new Date();
  
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i); // Increment the day
      generateSlots(venue, date); // Generate slots for each day
    }
  
    console.log("Slots successfully generated for the entire week.");
  };
  
  export const generateSlotsForMonth = async (venue) => {
    const today = new Date();
  
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i); // Increment the day
      await generateSlots(venue, date); // Generate slots for each day
    }
  
    console.log("Slots successfully generated for the entire month.");
  };
  
  export const updateSlot = async (slotId) => {
    try {
      const slot = await Slot.FindById(slotId);
    } catch (error) {}
  };
  