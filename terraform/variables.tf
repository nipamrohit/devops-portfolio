variable "instance_type" {
  default = "t2.micro"
}

variable "ami_id" {
  default = "ami-02c57ce16e9a8e906"  # Ubuntu 22.04 (ap-south-1)
}

variable "key_name" {
  default = "devsecops-key"
}