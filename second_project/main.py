def __tip_calculator():
    print("Welcome to the tip calculator!")
    total_bill = float(input("What was the total bill?"))
    tip_percent = int(input("How much tip would you like to give? 10, 12 or 15"))
    people = int(input("How many people to split the bill?"))
    tip = ((tip_percent/100)*total_bill)
    final_bill= (total_bill+tip)/people

    print(f"Each person should pay: ${final_bill:.2f}")


if __name__ == '__main__':
    __tip_calculator()
