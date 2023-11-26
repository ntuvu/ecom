const jsonString =
  '{"conditons":"[{\\"condition\\":\\"equal\\",\\"target\\":\\"amount_spent\\",\\"value\\":\\"50000\\",\\"_id\\":\\"655c57b1200d6a9cc023f8fc\\"},{\\"condition\\":\\"exactly\\",\\"target\\":\\"customer_added_date\\",\\"value\\":\\"2023-11-15T14:09:14+07:00\\",\\"_id\\":\\"655c57b1200d6a9cc023f8fd\\"},{\\"condition\\":\\">= -7d\\",\\"target\\":\\"abandoned_checkout_date\\",\\"value\\":\\"\\",\\"_id\\":\\"655c57b1200d6a9cc023f8fe\\"}]"}';

const data = JSON.parse(jsonString);
const conditions = JSON.parse(data.conditons);

console.log(conditions);
