'use strict';

function CardController(client, cards, CardService) {
	'ngInject';
	let vm = this;
	vm.client = client.data;
 	vm.cards = cards.data;
	vm.name = `${vm.client.primerNombre} ${vm.client.primerApellido}`;
	vm.focusedCard = null;
	vm.state = false;
	vm.editCode = '';

	vm.setFocus = card =>  {
		vm.focusedCard = card;
		vm.state = vm.focusedCard.estado == 'Activo';
		vm.editCode = vm.focusedCard.idTarjeta;
	};

	vm.edit = () => {
		let estado = vm.state ? 'Activo' : 'Inactivo';
		let data = Object.assign({}, vm.focusedCard);
		data.estado = estado;
		data.idTarjeta = vm.editCode;
		let promise = CardService.updateCard(data);

		promise.then(() => Materialize.toast('Tarjeta modificada', 5000));
		promise.catch(() => Materialize.toast('Error al guardar tarjeta', 5000));
		promise.finally(() => vm.loadCards());
	}

	vm.post = () => {
		let estado = 'Activo';
		let idTarjeta = vm.post.code;
		let idCliente = vm.client.idCliente;
		let saldo = 1000;
		let data = {estado, idTarjeta, saldo, idCliente};

		let promise = CardService.postCard(data);
		promise.then(() => Materialize.toast('Tarjeta agregada', 5000));
		promise.catch(() => Materialize.toast('Error al guardar tarjeta', 5000));
		promise.finally(() => vm.loadCards());
	}

	vm.getCards = () => CardService.getCardsByClient(vm.client.idCliente);

	vm.loadCards = () => vm.getCards().then(response => vm.cards = response.data);
}

export default {
  name: 'CardController',
  fn: CardController
};
