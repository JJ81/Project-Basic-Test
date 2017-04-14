var util = {};

util.checkIsEmail = (email) => {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
};

util.checkDigit = (num) => {
	return (num.match(/\d+/g) != null);
};

util.hiddenCharacter = (character, digit) => {
	var
		size = character.length,
		arr = character.split(''),
		hiddenSize = digit || Math.ceil(size/2);
	for(var i=0;i<size;i++){
		if(i < hiddenSize){
			arr[i] = '*';
		}
	}
	return arr.join('');
};

util.checkContainLetter = (str) => {
	return /[a-z]/.test(str.toLowerCase());
};

util.checkHttpsWithRef = (ref) => {
	return new RegExp('^(https)://', 'i').test(ref);
};


util.getDataByChannelId = (data, channel_id) =>{
	for(var i=0,size=data.length;i<size;i++){
		if(data[i].super_channel === channel_id){
			return data[i];
		}
	}
	return null;
};
module.exports = util;