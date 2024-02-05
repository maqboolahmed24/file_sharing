
public class Employee {
    private String name;
    private double salary;

    public Employee(String name, double salary) {
        this.name = name;
        this.salary = salary;
    }

    public String getName() {
        return name;
    }

    public double getSalary() {
        return salary;
    }
    
    // Method to get annual salary
    public double getAnnualSalary() {
        return roundSalary(this.salary * 12);
    }

    // Rounding method
    protected double roundSalary(double amount) {
        return Math.round(amount * 100.0) / 100.0;
    }
}
