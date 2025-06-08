# Name: Angelia-Grace Martin
# OSU Email: marticad@oregonstate.edu
# Course: CS261 - Data Structures
# Assignment: Assignment 6: HashMap Implementations
# Due Date: 3-17-2023
# Description: Implementation of a HashMap data structure that handles collisions via open
# addressing.

from a6_include import (DynamicArray, DynamicArrayException, HashEntry,
                        hash_function_1, hash_function_2)


class HashMap:
    def __init__(self, capacity: int, function) -> None:
        """
        Initialize new HashMap that uses
        quadratic probing for collision resolution
        DO NOT CHANGE THIS METHOD IN ANY WAY
        """
        self._buckets = DynamicArray()

        # capacity must be a prime number
        self._capacity = self._next_prime(capacity)
        for _ in range(self._capacity):
            self._buckets.append(None)

        self._hash_function = function
        self._size = 0

    def __str__(self) -> str:
        """
        Override string method to provide more readable output
        DO NOT CHANGE THIS METHOD IN ANY WAY
        """
        out = ''
        for i in range(self._buckets.length()):
            out += str(i) + ': ' + str(self._buckets[i]) + '\n'
        return out

    def _next_prime(self, capacity: int) -> int:
        """
        Increment from given number to find the closest prime number
        DO NOT CHANGE THIS METHOD IN ANY WAY
        """
        if capacity % 2 == 0:
            capacity += 1

        while not self._is_prime(capacity):
            capacity += 2

        return capacity

    @staticmethod
    def _is_prime(capacity: int) -> bool:
        """
        Determine if given integer is a prime number and return boolean
        DO NOT CHANGE THIS METHOD IN ANY WAY
        """
        if capacity == 2 or capacity == 3:
            return True

        if capacity == 1 or capacity % 2 == 0:
            return False

        factor = 3
        while factor ** 2 <= capacity:
            if capacity % factor == 0:
                return False
            factor += 2

        return True

    def get_size(self) -> int:
        """
        Return size of map
        DO NOT CHANGE THIS METHOD IN ANY WAY
        """
        return self._size

    def get_capacity(self) -> int:
        """
        Return capacity of map
        DO NOT CHANGE THIS METHOD IN ANY WAY
        """
        return self._capacity

    # ------------------------------------------------------------------ #

    def put(self, key: str, value: object) -> None:
        """
        If key is found in HashMap, updates existing value. Otherwise, adds new key-value pair.
        """

        if self.table_load() >= 0.5:
            self.resize_table(self._capacity * 2)

        hash_index = self._hash_function(key) % self._capacity

        if self._buckets[hash_index] is None or self._buckets[hash_index].is_tombstone:
            self._buckets[hash_index] = HashEntry(key, value)
            self._size += 1
        elif self._buckets[hash_index].key == key:
            self._buckets[hash_index].value = value
        else:
            probe_index = 0
            current_hash_index = hash_index
            while self._buckets[current_hash_index] is not None:
                if self._buckets[current_hash_index].key == key:
                    self._buckets[current_hash_index].value = value
                    return
                # probing
                current_hash_index = (hash_index + (probe_index*probe_index)) % self._capacity
                probe_index += 1
            self._buckets[current_hash_index] = HashEntry(key, value)
            self._size += 1

        return

    def table_load(self) -> float:
        """
        Returns the load factor (size over capacity) of the table as a float.
        """
        return self._size / self._capacity

    def empty_buckets(self) -> int:
        """
        Returns how many empty buckets are in the HashMap.
        """
        return self._capacity - self._size

    def resize_table(self, new_capacity: int) -> None:
        """
        Resizes the HashMap according to a passed capacity, then rehashes the keys.
        """
        if new_capacity < 1:
            return

        if new_capacity < self._size:
            return

        if self._is_prime(new_capacity):
            pass
        else:
            new_capacity = self._next_prime(new_capacity)

        if self._size / new_capacity >= 0.5:
            new_capacity = self._next_prime(new_capacity*2)

        # new dynamic array with new capacity
        new_buckets = DynamicArray()
        for bucket_index in range(new_capacity):
            new_buckets.append(None)

        # copy everything over
        for bucket_index in range(self._capacity):
            if self._buckets[bucket_index] is not None and self._buckets[bucket_index].is_tombstone is False:
                entry = self._buckets[bucket_index]
                hash_index = self._hash_function(entry.key) % new_capacity
                if new_buckets[hash_index] is None or new_buckets[hash_index].is_tombstone:
                    new_buckets[hash_index] = HashEntry(entry.key, entry.value)
                elif new_buckets[hash_index].key == entry.key:
                    new_buckets[hash_index].value = entry.value
                else:
                    probe_index = 0
                    current_hash_index = hash_index
                    while new_buckets[current_hash_index] is not None and new_buckets[current_hash_index].is_tombstone is False:
                        if new_buckets[current_hash_index].key == entry.key:
                            new_buckets[current_hash_index].value = entry.value
                            break
                        # probing
                        current_hash_index = (hash_index + (probe_index*probe_index)) % new_capacity
                        probe_index += 1
                    new_buckets[current_hash_index] = HashEntry(entry.key, entry.value)
        self._buckets = new_buckets
        self._capacity = new_capacity
        return

    def get(self, key: str) -> object:
        """
        Returns value via key lookup.
        """
        init_hash_index = self._hash_function(key) % self._capacity
        hash_index = init_hash_index
        probe_index = 0
        while self._buckets[hash_index] is not None and self._buckets[hash_index].is_tombstone is False:
            if self._buckets[hash_index].key == key:
                return self._buckets[hash_index].value
            # probing
            hash_index = (init_hash_index + (probe_index*probe_index)) % self._capacity
            probe_index += 1
        return

    def contains_key(self, key: str) -> bool:
        """
        Returns True if HashMap contains the passed key, and False otherwise.
        """
        init_hash_index = self._hash_function(key) % self._capacity
        hash_index = init_hash_index
        probe_index = 0
        while self._buckets[hash_index] is not None:
            if self._buckets[hash_index].key == key and not self._buckets[hash_index].is_tombstone:
                return True
            else:
                hash_index = (init_hash_index + (probe_index*probe_index)) % self._capacity
                probe_index += 1
        return False

    def remove(self, key: str) -> None:
        """
        Removes key-value if found in HashMap; does nothing otherwise.
        """
        # calc hash, modulo
        init_hash_index = self._hash_function(key) % self._capacity
        hash_index = init_hash_index
        probe_index = 0
        # remove
        while self._buckets[hash_index] is not None:
            if self._buckets[hash_index].key == key and self._buckets[hash_index].is_tombstone is False:
                self._buckets[hash_index].is_tombstone = True
                self._size -= 1
                return
            else:
                hash_index = (init_hash_index + (probe_index*probe_index)) % self._capacity
                probe_index += 1

        return

    def clear(self) -> None:
        """
        Clears the HashMap, making every bucket empty.
        """
        for bucket_index in range(self._capacity):
            self._buckets[bucket_index] = None
        self._size = 0
        return

    def get_keys_and_values(self) -> DynamicArray:
        """
        Returns all key-value pairs as a nice readable array.
        """
        keys_values_array = DynamicArray()
        for bucket_index in range(self._capacity):
            entry = self._buckets[bucket_index]
            if self._buckets[bucket_index] is not None and not self._buckets[bucket_index].is_tombstone:
                keys_values_array.append((entry.key, entry.value))
        return keys_values_array

    def __iter__(self):
        """
        Initializes iterator for HashMap.
        """
        self._index = 0
        return self

    def __next__(self):
        """
        Provides next value for iterator.
        """
        try:
            current_val = self._buckets[self._index]
        except DynamicArrayException:
            raise StopIteration

        while current_val is None or current_val.is_tombstone:
            self._index += 1
            try:
                current_val = self._buckets[self._index]
            except DynamicArrayException:
                raise StopIteration

        self._index += 1
        return current_val


# ------------------- BASIC TESTING ---------------------------------------- #

if __name__ == "__main__":

    print("\nPDF - put example 1")
    print("-------------------")
    m = HashMap(53, hash_function_1)
    for i in range(150):
        m.put('str' + str(i), i * 100)
        if i % 25 == 24:
            print(m.empty_buckets(), round(m.table_load(), 2), m.get_size(), m.get_capacity())

    print("\nPDF - put example 2")
    print("-------------------")
    m = HashMap(41, hash_function_2)
    for i in range(50):
        m.put('str' + str(i // 3), i * 100)
        if i % 10 == 9:
            print(m.empty_buckets(), round(m.table_load(), 2), m.get_size(), m.get_capacity())

    print("\nPDF - table_load example 1")
    print("--------------------------")
    m = HashMap(101, hash_function_1)
    print(round(m.table_load(), 2))
    m.put('key1', 10)
    print(round(m.table_load(), 2))
    m.put('key2', 20)
    print(round(m.table_load(), 2))
    m.put('key1', 30)
    print(round(m.table_load(), 2))

    print("\nPDF - table_load example 2")
    print("--------------------------")
    m = HashMap(53, hash_function_1)
    for i in range(50):
        m.put('key' + str(i), i * 100)
        if i % 10 == 0:
            print(round(m.table_load(), 2), m.get_size(), m.get_capacity())

    print("\nPDF - empty_buckets example 1")
    print("-----------------------------")
    m = HashMap(101, hash_function_1)
    print(m.empty_buckets(), m.get_size(), m.get_capacity())
    m.put('key1', 10)
    print(m.empty_buckets(), m.get_size(), m.get_capacity())
    m.put('key2', 20)
    print(m.empty_buckets(), m.get_size(), m.get_capacity())
    m.put('key1', 30)
    print(m.empty_buckets(), m.get_size(), m.get_capacity())
    m.put('key4', 40)
    print(m.empty_buckets(), m.get_size(), m.get_capacity())

    print("\nPDF - empty_buckets example 2")
    print("-----------------------------")
    m = HashMap(53, hash_function_1)
    for i in range(150):
        m.put('key' + str(i), i * 100)
        if i % 30 == 0:
            print(m.empty_buckets(), m.get_size(), m.get_capacity())

    print("\nPDF - resize example 1")
    print("----------------------")
    m = HashMap(23, hash_function_1)
    m.put('key1', 10)
    print(m.get_size(), m.get_capacity(), m.get('key1'), m.contains_key('key1'))
    m.resize_table(30)
    print(m.get_size(), m.get_capacity(), m.get('key1'), m.contains_key('key1'))

    print("\nPDF - resize example 2")
    print("----------------------")
    m = HashMap(79, hash_function_2)
    keys = [i for i in range(1, 1000, 13)]
    for key in keys:
        m.put(str(key), key * 42)
    print(m.get_size(), m.get_capacity())

    for capacity in range(111, 1000, 117):
        m.resize_table(capacity)

        if m.table_load() > 0.5:
            print(f"Check that the load factor is acceptable after the call to resize_table().\n"
                  f"Your load factor is {round(m.table_load(), 2)} and should be less than or equal to 0.5")

        m.put('some key', 'some value')
        result = m.contains_key('some key')
        m.remove('some key')

        for key in keys:
            # all inserted keys must be present
            result &= m.contains_key(str(key))
            # NOT inserted keys must be absent
            result &= not m.contains_key(str(key + 1))
        print(capacity, result, m.get_size(), m.get_capacity(), round(m.table_load(), 2))

    print("\nPDF - get example 1")
    print("-------------------")
    m = HashMap(31, hash_function_1)
    print(m.get('key'))
    m.put('key1', 10)
    print(m.get('key1'))

    print("\nPDF - get example 2")
    print("-------------------")
    m = HashMap(151, hash_function_2)
    for i in range(200, 300, 7):
        m.put(str(i), i * 10)
    print(m.get_size(), m.get_capacity())
    for i in range(200, 300, 21):
        print(i, m.get(str(i)), m.get(str(i)) == i * 10)
        print(i + 1, m.get(str(i + 1)), m.get(str(i + 1)) == (i + 1) * 10)

    print("\nPDF - contains_key example 1")
    print("----------------------------")
    m = HashMap(11, hash_function_1)
    print(m.contains_key('key1'))
    m.put('key1', 10)
    m.put('key2', 20)
    m.put('key3', 30)
    print(m.contains_key('key1'))
    print(m.contains_key('key4'))
    print(m.contains_key('key2'))
    print(m.contains_key('key3'))
    m.remove('key3')
    print(m.contains_key('key3'))

    print("\nPDF - contains_key example 2")
    print("----------------------------")
    m = HashMap(79, hash_function_2)
    keys = [i for i in range(1, 1000, 20)]
    for key in keys:
        m.put(str(key), key * 42)
    print(m.get_size(), m.get_capacity())
    result = True
    for key in keys:
        # all inserted keys must be present
        result &= m.contains_key(str(key))
        # NOT inserted keys must be absent
        result &= not m.contains_key(str(key + 1))
    print(result)

    print("\nPDF - remove example 1")
    print("----------------------")
    m = HashMap(53, hash_function_1)
    print(m.get('key1'))
    m.put('key1', 10)
    print(m.get('key1'))
    m.remove('key1')
    print(m.get('key1'))
    m.remove('key4')

    print("\nPDF - clear example 1")
    print("---------------------")
    m = HashMap(101, hash_function_1)
    print(m.get_size(), m.get_capacity())
    m.put('key1', 10)
    m.put('key2', 20)
    m.put('key1', 30)
    print(m.get_size(), m.get_capacity())
    m.clear()
    print(m.get_size(), m.get_capacity())

    print("\nPDF - clear example 2")
    print("---------------------")
    m = HashMap(53, hash_function_1)
    print(m.get_size(), m.get_capacity())
    m.put('key1', 10)
    print(m.get_size(), m.get_capacity())
    m.put('key2', 20)
    print(m.get_size(), m.get_capacity())
    m.resize_table(100)
    print(m.get_size(), m.get_capacity())
    m.clear()
    print(m.get_size(), m.get_capacity())

    print("\nPDF - get_keys_and_values example 1")
    print("------------------------")
    m = HashMap(11, hash_function_2)
    for i in range(1, 6):
        m.put(str(i), str(i * 10))
    print(m.get_keys_and_values())

    m.resize_table(2)
    print(m.get_keys_and_values())

    m.put('20', '200')
    m.remove('1')
    m.resize_table(12)
    print(m.get_keys_and_values())

    print("\nPDF - __iter__(), __next__() example 1")
    print("---------------------")
    m = HashMap(10, hash_function_1)
    for i in range(5):
        m.put(str(i), str(i * 10))
    print(m)
    for item in m:
        print('K:', item.key, 'V:', item.value)

    print("\nPDF - __iter__(), __next__() example 2")
    print("---------------------")
    m = HashMap(10, hash_function_2)
    for i in range(5):
        m.put(str(i), str(i * 24))
    m.remove('0')
    m.remove('4')
    print(m)
    for item in m:
        print('K:', item.key, 'V:', item.value)