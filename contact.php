<?php

	if( isset($_POST["contact-name"]) && isset($_POST["contact-email"]) && isset($_POST["contact-message"]) ){
		// Contact name
		$name = $_POST["contact-name"]; 

		// Mail of sender
		$mail_from= $_POST["contact-email"]; 

		// Details
		$message= $_POST["contact-message"];

		$full_message= "Name: ".$name." <br> Email: ".$mail_from. " <br> Message: ". $message. " <br> Peace, Gilly";

		// From 
		$header="from: ".$name." ".$mail_from;

		// Enter your email address
		$to ='nathanjamal@ymail.com';
		$send_contact=mail($to,'Yo Nate, someone hit you up on the site...',$full_message,$header);

	}

?>