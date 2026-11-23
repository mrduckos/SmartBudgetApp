type CategorySummaryProps = {
    categoryEntries: [string, number][]
}

export default function CategorySummary ({
    categoryEntries,
} : CategorySummaryProps) {
    return (
        <section className='category-summary'>
        <h2>Expenses by category</h2>

        {categoryEntries.length === 0 ? (
          <p>No expenses yet</p>
        ) : (
          <div className='category-list'>
            {categoryEntries.map(([category, amount]) => (
              <div 
                className='category-row'
                key={category}
                >
                  <span>{category}</span>

                  <strong>
                    {amount.toFixed(2)} €
                  </strong>
                </div>
            ))}
          </div>
        )}
      </section>
    )
}