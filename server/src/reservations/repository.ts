import {Knex} from 'knex';
import {BaseRepository} from '../model/base';
import {ProductAssigment, ProductCharge} from './model';
import productAssignments from './product_assignment.json';
import productCharges from './product_charges.json';

export class ReservationsRepository extends BaseRepository {
	
	constructor(knexClient: Knex) {
		super(knexClient, 'reservations');
	}
	
	findProductAssignments(): ReadonlyArray<ProductAssigment> {
		return productAssignments.map((productAssignment) => {
			return {
				id: productAssignment.id,
				reservationUuid: productAssignment.reservation_uuid,
				name: productAssignment.name
			};
		});
	}
	
	findProductCharges(): ReadonlyArray<ProductCharge> {
		return productCharges.map((productCharge) => {
			return {
				specialProductAssignmentId: productCharge.special_product_assignment_id,
				active: productCharge.active,
				amount: productCharge.amount
			};
		});
	}
}
