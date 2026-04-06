import { ReservationRepository } from './reservation.repository.js';

export class ReservationService {
  static async list(tenantId) { return ReservationRepository.findAllByTenant(tenantId); }

  static async getById(id, tenantId) {
    const r = await ReservationRepository.findById(id, tenantId);
    if (!r) throw new Error('NOT_FOUND');
    return r;
  }

  static async create(data) {
    const conflicts = await ReservationRepository.findConflicts(
      data.tenantId, data.roomId, new Date(data.checkIn), new Date(data.checkOut),
    );
    if (conflicts.length > 0) throw new Error('ROOM_CONFLICT');
    return ReservationRepository.create(data);
  }

  static async update(id, tenantId, data) {
    if (data.roomId && data.checkIn && data.checkOut) {
      const conflicts = await ReservationRepository.findConflicts(
        tenantId, data.roomId, new Date(data.checkIn), new Date(data.checkOut), id,
      );
      if (conflicts.length > 0) throw new Error('ROOM_CONFLICT');
    }
    return ReservationRepository.update(id, tenantId, data);
  }

  static async updateStatus(id, tenantId, status) {
    const allowed = ['confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show'];
    if (!allowed.includes(status)) throw new Error('INVALID_STATUS');
    return ReservationRepository.updateStatus(id, tenantId, status);
  }

  static async delete(id, tenantId) { return ReservationRepository.delete(id, tenantId); }
}
