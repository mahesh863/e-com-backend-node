import { Transaction } from 'sequelize';
import Address, { AddressInput } from '../model/address.model';

export const addAddressDAL = async (address: AddressInput, transaction?: Transaction): Promise<Address> => {
  let newAddress;

  if (transaction) {
    newAddress = await Address.create(address, { transaction });
  } else {
    newAddress = await Address.create(address);
  }
  return newAddress;
};
