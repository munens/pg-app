import {config} from 'dotenv';
import {BaseService} from '../model/base';
import {ReservationsRepository} from './repository';
import _ from 'lodash';

config();

export class ReservationsService extends BaseService {
	
	constructor(protected readonly repository: ReservationsRepository) {
		super(repository);
	}
	
	getReservations(): any[]{//ReadonlyArray<ReservationDto> {
		const productAssignments = this.repository.findProductAssignments();
		const productCharges = this.repository.findProductCharges();
		
		const groupedAssignments = _.groupBy(productAssignments, 'reservationUuid');
		const assignments = Object.values(groupedAssignments)
			.map((assignments) => {
				return assignments.reduce((acc, assignment) => ({
					ids: [...acc.ids, assignment.id],
					names: [...acc.names, assignment.name],
					reservationUuid: assignment.reservationUuid
				}), { ids: [], names: [], reservationUuid: ''});
			});
		
		const productChargesMap = _.groupBy(productCharges, 'specialProductAssignmentId');
		
		return assignments.map((assignment) => {
			const productCharges = _.flatten(
				assignment.ids
					.map((id) => productChargesMap[id])
					.filter((v) => v)
			);
			
			const sumOfActivePurchases = productCharges.reduce((acc, product) => acc + product.amount, 0);
			
			return {
				reservationUuid: assignment.reservationUuid,
				activePurchases: productCharges?.length ?? 0,
				sumOfActivePurchases,
				productCharges: productCharges.map((productCharge, index) => ({
					productName: assignment.names[index],
					status: productCharge.active ? 'active': 'cancelled',
					charge: productCharge.amount
				}))
			};
		}).filter((reservation) => reservation.productCharges.length > 0);
	}
	
}