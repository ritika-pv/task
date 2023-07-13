const User = require("../models/User");

exports.registerUser = async (req, res) => {
    try {
        const { username,
            firstName,
            lastName,
            email,
            password,
            phone,
            userStatus } = req.body;
            let user = await User.findOne({ $or: [{ username }, { email }] });

        
        if (user && user.userStatus==0) {
            return res.status(400)
                .json({ success: false, message: "User already exists" });
        }

        //user was deleted = in this case change userstatus from 1 to 0
        if (user && user.userStatus==1) {
            console.log(user.userStatus)
        user.userStatus=0;

        // Save the updated user
        await user.save();
        console.log(user.userStatus)
            return res.status(200)
                .json({ success: false, message: "User added successfully" });
        }
        user = await User.create({
            username,
            firstName,
            lastName,
            email,
            password,
            phone,
            userStatus
        });

        //log in simultaneously
        const token = await user.generateToken();

        const options = {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };
        //save the token in cookies
        res.status(201).cookie("token", token, options).json({
            message: "User registered and logged in successfully",
            success: true,
            user,
            token,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username }).select("+password");
        //console.log(user)
        if (!user) {
            return res.status(400)
                .json({ success: false, message: "User does not exists" });
        }
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(400)
                .json({ success: false, message: "Invalid password" });
        }

        const token = await user.generateToken();

        const options = {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };

        res.status(200).cookie("token", token, options).json({
            message: "User logged in successfully",
            success: true,
            user,

        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


exports.getUser = async (req, res) => {
    const { username } = req.params;

    try {
        // Find the user by the username
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // if user is already deleted
        if (user.userStatus == 1) {
            return res.status(403).json({ message: 'User was deleted' });
        }


        res.status(200).json({ message: 'User found successfully', user });
    } catch (error) {

        res.status(500).json({ message: 'Internal server error' });
    }
};



exports.updateUser = async (req, res) => {
    const { username } = req.params;
    const updatedUser = req.body;

    try {
        // Find the user by the username
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        //user exists but it was deleted earlier
        if(user &&  user.userStatus==1){
            return res.status(400).json({ message: 'User not found' });
        }
        // Ensuring that only the logged in user can update their own details
        // authentication mechanism is implementedto get the logged in user information
        // Here, we assume you have a req.user object containing the logged in user details
        if (user.username !== req.user.username) {
            return res.status(401).json({ message: 'Unauthorized ! Please login first' });
        }

        // Update the user fields
        user.username = updatedUser.username;
        user.firstName = updatedUser.firstName;
        user.lastName = updatedUser.lastName;
        user.email = updatedUser.email;
        user.password = updatedUser.password;
        user.phone = updatedUser.phone;

        // Save the updated user
        await user.save();

        res.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.deleteUser = async (req, res) => {
    const { username } = req.params;

    try {
        // Find the user by the username
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if(user.userStatus==1){
            return res.status(400).json({ message: 'User was already deleted' });
        }
        // Set the userStatus to 1 to mark it as deleted
        user.userStatus = 1;
        await user.save();

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.createManyUsers = async (req, res) => {
    try {
        const requiredAttributes = ['username', 'firstName', 'lastName', 'email', 'password', 'phone'];
        if (Object.keys(req.body).length === 0) {
            res.status(400).json({ success: false, message: "Please Enter An Array" })
        }
        const missingAttributes = req.body.filter(user => !user.username || !user.firstName || !user.lastName || !user.phone || !user.email || !user.password);

        // const missingAttributes = req.body.reduce((missing, element) => {
        //     const missingInElement = requiredAttributes.filter(attr => !(attr in element));
        //     return missing.concat(missingInElement);
        // }, []);

        if (missingAttributes.length > 0) {
            return res.status(400).json({ success: false, message: `Missing attributes: ${missingAttributes.join(', ')}` });
        }
        const uniqueUsers = [];
        await Promise.all(req.body.map(async (element) => {
            let email = element.email;
            let user = await User.findOne({ email });
            if (!user) {
                console.log(element);
                uniqueUsers.push(element);
            }
        }));
        if (uniqueUsers.length === 0) {
            res.status(400).json({ success: false, message: "No Unique Entities Found" });
        }
        const createdUsers = await User.insertMany(uniqueUsers);
        console.log('Users created:', createdUsers);
        res.status(201).json({ success: true, message: createdUsers });
    } catch (error) {
        // console.log('Error in Creating Many Users',error.code);
        res.status(500).json({ message: 'Internal server error' });
    }
};

