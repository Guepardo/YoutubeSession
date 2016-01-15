var Factory = function(){
	this.namesArray = [
		'Leão',
		'Leopardo',
		'Cachorro',
		'Marciano',
		'Jaguatirica',
		'Jaguar',
		'Chimpazé',
		'Tartaruga',
		'Orca',
		'Galinha',
		'Gavião',
		'Águia',
		'Camelo',
		'Jumento'
	]; 
}; 

Factory.prototype.names = function(){
  return this.namesArray[Math.floor(Math.random() * this.namesArray.length) ]; 
}; 

Factory.prototype.images = function(){

}; 


module.exports = Factory; 