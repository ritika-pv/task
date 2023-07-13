const Pet = require("../models/Pet");
const mongoose = require('mongoose')

exports.addPet = async (req, res) => {

    try {
        const { category, name, photoUrls, status } = req.body;
        // Create a new pet
        const pet = await Pet.create({ category, name, photoUrls, status });

        res.status(201).json({ message: 'Pet created successfully', pet });
    } catch (error) {
        //console.error('Error creating pet:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}



exports.deletePet = async (req, res) => {
    const { petId } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(petId)) {
            return res.status(400).json({ error: 'Invalid order ID  (enter correct   "TYPE"  of petId)' });
        }
        const pet = await Pet.findById(petId);
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }
        const deletedPet = await Pet.findByIdAndDelete(petId);

        if (deletedPet) {
            res.status(200).json({ message: 'Pet deleted successfully' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}



exports.getPet = async (req, res) => {
    const { petId } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(petId)) {
            return res.status(400).json({ error: 'Invalid pet ID  (enter correct   "TYPE"  of petId)' });
        }

        const pet = await Pet.findById(petId);

        if (!pet) {
            return res.status(404).json({ message: 'Pet not found ' });
        }
        res.status(200).json({ message: 'pet found successfully', pet });
    } catch (error) {

        res.status(500).json({ message: error.message });
    }
};


exports.findByStatus = async (req, res) => {
   // console.log("hiiting")
    //const { status } = req.query;
    console.log(req.query);
    try {
        const pets = await Pet.find({ status });
        console.log(pets)
        if (pets.length > 0) {
            res.status(200).json(pets);
        } else {
            res.status(404).json({ error: 'No pets found with the given status' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


exports.updatePet=async(req,res)=>{
   const _id =req.body._id
    const updatedPet = req.body;
    //  console.log(_id);
    //  console.log(updatedPet);
    try {

        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({ error: 'Invalid pet ID  (enter correct   "TYPE"  of petId)' });
        }
        // Find the user by the username
        const pet = await Pet.findById({_id});

        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

       
        //console.log("  this  ",updatedPet.category.id);
        // Update the Pet fields
        pet.category.id = updatedPet.category.id;
        pet.category.name = updatedPet.category.name;
        pet.name = updatedPet.name;
        pet.status = updatedPet.status;

        // Save the updated Pet
        await pet.save();
         res.json({ message: 'Pet updated successfully' });
    } catch (error) {
        console.error('Error updating Pet:', error);
        res.status(500).json({ message: error.message });
    }
}


