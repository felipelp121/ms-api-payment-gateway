-- INSERT USERS

INSERT INTO users
(
 name, 
 email, 
 password, 
 type_document, 
 document, 
 birthdate, 
 created_at, 
 updated_at
)
 VALUES
 (
	 'Felipe Lopes',
	 'felipe@hotmail.com',
	 '123456',
	 'cpf',
	 '11111111',
	 '14/04/97',
	 CURRENT_TIMESTAMP,
	 CURRENT_TIMESTAMP
 )



INSERT INTO address
(
 user_id, 
 street, 
 number, 
 complement, 
 locality, 
 city,
 region,
 region_code,
 country,
 postal_code,
 created_at, 
 updated_at
)
 VALUES
 (
	 1,
	 'Rua 1',
	 10,
	 'bl. 1 apto. 1',
	 'Itapuca',
	 'Niterói',
	 'RJ',
	 'BRA',
	 '20202020',
	 CURRENT_TIMESTAMP,
	 CURRENT_TIMESTAMP
 )
 
