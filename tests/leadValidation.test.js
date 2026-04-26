import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isLeadNameValid,
  isLeadEmailValid,
  isLeadWhatsappValid,
  isLeadDataValid
} from '../src/core/leadValidation.js';

test('nome deve ter mais de 2 caracteres', () => {
  assert.equal(isLeadNameValid('Al'), false);
  assert.equal(isLeadNameValid('Ana'), true);
});

test('email deve seguir formato texto@texto', () => {
  assert.equal(isLeadEmailValid('sem-arroba.com'), false);
  assert.equal(isLeadEmailValid('a@b'), true);
});

test('whatsapp deve ter ao menos 8 caracteres', () => {
  assert.equal(isLeadWhatsappValid('1234567'), false);
  assert.equal(isLeadWhatsappValid('12345678'), true);
});

test('validação completa habilita somente com todos os campos válidos', () => {
  assert.equal(isLeadDataValid({ name: 'Ana', email: 'ana@empresa', whatsapp: '11999999' }), true);
  assert.equal(isLeadDataValid({ name: 'An', email: 'ana@empresa', whatsapp: '11999999' }), false);
  assert.equal(isLeadDataValid({ name: 'Ana', email: 'anaempresa.com', whatsapp: '11999999' }), false);
  assert.equal(isLeadDataValid({ name: 'Ana', email: 'ana@empresa', whatsapp: '1234567' }), false);
});
