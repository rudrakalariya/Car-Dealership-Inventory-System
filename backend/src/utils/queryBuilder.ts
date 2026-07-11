export class QueryBuilder {
  private tableName: string;
  private selectCols: string[] = ['*'];
  private whereClauses: string[] = [];
  private values: (string | number)[] = [];
  private orderClause = '';

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  select(columns: string[]): this {
    this.selectCols = columns;
    return this;
  }

  whereIlike(column: string, value: string | undefined): this {
    if (value) {
      this.values.push(`%${value}%`);
      this.whereClauses.push(`${column} ILIKE $${this.values.length}`);
    }
    return this;
  }

  whereGte(column: string, value: string | undefined): this {
    if (value) {
      this.values.push(parseFloat(value));
      this.whereClauses.push(`${column} >= $${this.values.length}`);
    }
    return this;
  }

  whereLte(column: string, value: string | undefined): this {
    if (value) {
      this.values.push(parseFloat(value));
      this.whereClauses.push(`${column} <= $${this.values.length}`);
    }
    return this;
  }

  orderBy(column: string, direction: 'ASC' | 'DESC'): this {
    this.orderClause = `ORDER BY ${column} ${direction}`;
    return this;
  }

  build(): { text: string; values: (string | number)[] } {
    let text = `SELECT ${this.selectCols.join(', ')} FROM ${this.tableName}`;

    if (this.whereClauses.length > 0) {
      text += ` WHERE ${this.whereClauses.join(' AND ')}`;
    }

    if (this.orderClause) {
      text += ` ${this.orderClause}`;
    }

    return { text, values: this.values };
  }
}
