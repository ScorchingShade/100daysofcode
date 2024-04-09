def print_hi(name, a, b, operation):
    # Use a breakpoint in the code line below to debug your script.
    print(f'Hi, {name}')  # Press ⌘F8 to toggle the breakpoint.
    if operation == 'sum':
        print(a + b)
    elif operation == 'subtract':
        print(a - b)
    elif operation == 'multiply':
        print(a * b)
    elif operation == 'divide':
        if b == 0:
            print("b cannot be zero")
        else:
            print(f"{a / b:.2f}")
    else:
        print("nothing specified")


# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    print_hi('PyCharm', 2, 3, 'divide')

# See PyCharm help at https://www.jetbrains.com/help/pycharm/
